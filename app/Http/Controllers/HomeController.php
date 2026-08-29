<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Muestra la página principal de EATLY Plaza UPP
     */
    public function welcome(Request $request): Response
    {
        $branches = Branch::with(['restaurant', 'location', 'images', 'image'])
            ->where('is_active', true)
            ->whereHas('restaurant.owner', function ($query) {
                $query->where('role', 'merchant');
            })
            ->get()
            ->map(function ($branch) {
                $imageUrl = $branch->image?->url
                    ?? $branch->images->first()?->url
                    ?? $branch->restaurant?->image;

                return [
                    'id' => $branch->id,
                    'name' => $branch->name ?? 'Punto Gastronómico Plaza UPP',
                    'restaurant_name' => $branch->restaurant?->name ?? 'Cocina Plaza UPP',
                    'location' => $branch->location?->address_line ?? $branch->restaurant?->address ?? 'Plaza Gastronómica UPP',
                    'phone' => $branch->phone ?? '771 900 0000',
                    'schedule' => $branch->opening_hours ?? 'Lunes a Viernes - 7:00 AM a 6:00 PM',
                    'image' => $imageUrl,
                    'rating' => 4.8,
                    'delivery_time' => '10-20 min',
                ];
            });

        return Inertia::render('Welcome', [
            'branches' => $branches,
        ]);
    }
}