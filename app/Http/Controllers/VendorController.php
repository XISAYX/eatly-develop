<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Category;
use App\Models\Item;
use App\Models\Location;
use App\Models\Order;
use App\Models\Rating;
use App\Models\Restaurant;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class VendorController extends Controller
{
    private const STORAGE_PREFIX = '/storage/';

    /**
     * Muestra la terminal administrativa del comercio / punto gastronómico
     */
    public function index(): Response
    {
        $branchIds = Branch::pluck('id');
        $ratings = Rating::with(['user', 'order'])
            ->where('rateable_type', Branch::class)
            ->whereIn('rateable_id', $branchIds)
            ->latest()
            ->get();

        $branch = Branch::first();
        if (! $branch) {
            $restaurant = Restaurant::first() ?? Restaurant::create([
                'owner_id' => auth()->id() ?? 1,
                'name' => 'Punto Gastronómico Plaza UPP',
            ]);
            $branch = Branch::create([
                'restaurant_id' => $restaurant->id,
                'name' => 'Módulo Principal Plaza UPP',
                'is_active' => true,
            ]);
        }
        $branchId = $branch->id;

        $defaultCategories = ['Comida', 'Bebidas', 'Postres', 'Snacks', 'Combos'];
        foreach ($defaultCategories as $catName) {
            Category::firstOrCreate(
                ['name' => $catName, 'branch_id' => $branchId]
            );
        }

        return Inertia::render('Vendor/Dashboard', [
            'products' => Item::with('category')->latest()->get(),
            'categories' => Category::all(),
            'orders' => Order::with(['user', 'branch', 'items.item', 'driver'])->latest()->get(),
            'ratings' => $ratings,
        ]);
    }

    /**
     * Da de alta un nuevo platillo / especialidad en la carta
     */
    public function storeProduct(Request $request): RedirectResponse
    {
        $branch = Branch::first();
        if (! $branch) {
            $restaurant = Restaurant::first() ?? Restaurant::create([
                'owner_id' => auth()->id() ?? 1,
                'name' => 'Punto Gastronómico Plaza UPP',
            ]);
            $branch = Branch::create([
                'restaurant_id' => $restaurant->id,
                'name' => 'Módulo Principal Plaza UPP',
                'is_active' => true,
            ]);
        }
        $branchId = $branch->id;

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'is_available' => 'boolean',
            'sale_unit' => 'required|string|in:pieza,orden,otro',
            'unit_label' => 'nullable|string|max:50',
            'image' => 'nullable|image|max:5120',
        ]);

        $categoryId = $validated['category_id'] ?? Category::first()?->id ?? Category::create(['name' => 'General', 'branch_id' => $branchId])->id;

        $item = Item::create([
            'name' => $validated['name'],
            'category_id' => $categoryId,
            'price' => $validated['price'],
            'description' => $validated['description'] ?? '',
            'is_available' => $request->has('is_available') ? $request->is_available : true,
            'sale_unit' => $validated['sale_unit'] ?? 'orden',
            'unit_label' => $validated['unit_label'] ?? null,
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('items', 'public');
            $item->images()->create(['url' => self::STORAGE_PREFIX.$path]);
        }

        return redirect()->back()->with('success', 'Especialidad registrada en la carta.');
    }

    /**
     * Actualiza la información de una receta / especialidad
     */
    public function updateProduct(Request $request, Item $product): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'is_available' => 'boolean',
            'sale_unit' => 'required|string|in:pieza,orden,otro',
            'unit_label' => 'nullable|string|max:50',
            'image' => 'nullable|image|max:5120',
        ]);

        $product->update([
            'name' => $validated['name'],
            'category_id' => $validated['category_id'] ?? $product->category_id,
            'price' => $validated['price'],
            'description' => $validated['description'] ?? '',
            'is_available' => $request->has('is_available') ? $request->is_available : $product->is_available,
            'sale_unit' => $validated['sale_unit'] ?? 'orden',
            'unit_label' => $validated['unit_label'] ?? null,
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('items', 'public');
            $product->images()->delete();
            $product->images()->create(['url' => self::STORAGE_PREFIX.$path]);
        }

        return redirect()->back()->with('success', 'Especialidad actualizada correctamente.');
    }

    /**
     * Da de baja un artículo de la carta
     */
    public function destroyProduct(Item $product): RedirectResponse
    {
        $product->delete();

        return redirect()->back()->with('success', 'Especialidad retirada del menú.');
    }

    /**
     * Actualiza el estado de preparación de la comanda
     */
    public function updateOrderStatus(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|string|in:pending,preparing,ready,delivering,completed,delivered,cancelled',
        ]);

        $order->update(['status' => $validated['status']]);

        return redirect()->back()->with('success', 'Estado de la comanda actualizado.');
    }

    /**
     * Visualiza la ficha del local
     */
    public function profile(): Response
    {
        $user = auth()->user();
        $restaurant = Restaurant::firstOrCreate(
            ['owner_id' => $user->id],
            [
                'name' => $user->name.' - Punto Gastronómico',
                'description' => 'Especialidades culinarias en Plaza UPP.',
                'address' => 'Plaza Gastronómica UPP',
                'latitude' => 19.8145,
                'longitude' => -98.7389,
            ]
        );

        return Inertia::render('Vendor/Profile', [
            'restaurant' => $restaurant,
        ]);
    }

    /**
     * Actualiza los datos del local y horarios
     */
    public function updateProfile(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'address' => 'nullable|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'schedule' => 'nullable|array',
            'image' => 'nullable|image|max:5120',
        ]);

        $user = auth()->user();
        $restaurant = Restaurant::firstOrCreate(['owner_id' => $user->id]);

        $dataToUpdate = [
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'address' => $validated['address'] ?? null,
            'latitude' => $validated['latitude'] ?? null,
            'longitude' => $validated['longitude'] ?? null,
            'schedule' => $validated['schedule'] ?? null,
        ];

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('restaurants', 'public');
            $dataToUpdate['image'] = self::STORAGE_PREFIX.$path;
        }

        $restaurant->update($dataToUpdate);

        $branch = $restaurant->branches()->first();
        if ($branch) {
            $branch->update(['name' => $restaurant->name]);
        } else {
            Branch::create([
                'restaurant_id' => $restaurant->id,
                'name' => $restaurant->name,
                'is_active' => true,
            ]);
        }

        return redirect()->back()->with('success', 'Ficha comercial guardada con éxito.');
    }

    /**
     * Renderiza la pantalla React de afiliación comercial (Register.tsx)
     */
    public function showRegister(): Response
    {
        return Inertia::render('Vendor/Register');
    }

    /**
     * Procesa la solicitud de alta del establecimiento
     */
    public function storeRegister(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'restaurant_name' => 'required|string|max:255',
            'food_type' => 'required|string',
            'location' => 'required|string',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'terms' => 'accepted',
        ]);

        $user = User::create([
            'name' => $validated['restaurant_name'].' (Admin)',
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'merchant',
            'email_verified_at' => now(),
        ]);

        $restaurant = Restaurant::create([
            'owner_id' => $user->id,
            'name' => $validated['restaurant_name'],
            'description' => 'Especialidad en '.$validated['food_type'].' - Plaza UPP.',
            'phone' => $validated['phone'],
            'email' => $validated['email'],
            'address' => $validated['location'],
            'latitude' => 19.9625,
            'longitude' => -98.6834,
        ]);

        $location = Location::create([
            'country' => 'México',
            'state' => 'Hidalgo',
            'city' => 'Zempoala',
            'address_line' => $validated['location'],
            'postal_code' => '43830',
            'lat' => 19.9625,
            'lng' => -98.6834,
        ]);

        $branch = Branch::create([
            'restaurant_id' => $restaurant->id,
            'location_id' => $location->id,
            'name' => $validated['restaurant_name'].' - '.$validated['location'],
            'phone' => $validated['phone'],
            'is_active' => true,
        ]);

        Category::create([
            'name' => $validated['food_type'],
            'branch_id' => $branch->id,
        ]);

        Auth::login($user);

        return redirect()->route('vendor.dashboard')->with('success', 'Establecimiento afiliado correctamente a EATLY.');
    }
}