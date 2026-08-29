<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Directorio Maestro de Locales y Catálogo Gastronómico Plaza UPP - EATLY
 */
class EatlyCampusSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Administrador Operativo del Campus
        $rootUser = User::first();
        $adminIdentifier = $rootUser ? $rootUser->id : DB::table('users')->insertGetId([
            'name' => 'Administración EATLY UPP',
            'email' => 'operaciones@eatly.upp.edu.mx',
            'password' => bcrypt('Eatly2026!'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 2. Localización Física Principal
        try {
            $hasLocation = DB::table('locations')->where('id', 1)->exists();
            if (! $hasLocation) {
                $locationPayload = ['id' => 1, 'created_at' => now(), 'updated_at' => now()];

                if (Schema::hasColumn('locations', 'name')) {
                    $locationPayload['name'] = 'Plaza Gastronómica UPP';
                }
                if (Schema::hasColumn('locations', 'address_line')) {
                    $locationPayload['address_line'] = 'Plaza Central Universitaria, Carretera Pachuca - Cd. Sahagún';
                }

                DB::table('locations')->insert($locationPayload);
            }
        } catch (\Exception $ex) {
            DB::table('locations')->insertOrIgnore(['id' => 1]);
        }

        // 3. Entidad Corporativa / Hub Central
        $hasHub = DB::table('restaurants')->where('id', 1)->exists();
        if (! $hasHub) {
            $hubPayload = [
                'id' => 1,
                'owner_id' => $adminIdentifier,
                'created_at' => now(),
                'updated_at' => now(),
            ];

            if (Schema::hasColumn('restaurants', 'name')) {
                $hubPayload['name'] = 'EATLY Plaza UPP';
            }
            if (Schema::hasColumn('restaurants', 'description')) {
                $hubPayload['description'] = 'Red gastronómica y pedidos express de la Universidad Politécnica de Pachuca';
            }
            if (Schema::hasColumn('restaurants', 'phone')) {
                $hubPayload['phone'] = '771 980 4321';
            }
            if (Schema::hasColumn('restaurants', 'email')) {
                $hubPayload['email'] = 'contacto@eatly.mx';
            }
            if (Schema::hasColumn('restaurants', 'address')) {
                $hubPayload['address'] = 'Plaza UPP - Pachuca Hidalgo';
            }

            DB::table('restaurants')->insert($hubPayload);
        }

        // 4. Locales Reales de la Plaza UPP
        $plazaSpots = [
            [
                'id' => 1,
                'name' => 'Cafetería Octubre',
                'phone' => '771 934 8210',
                'opening_hours' => 'Lunes a Viernes - 7:00 AM a 6:00 PM',
                'image' => 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'id' => 2,
                'name' => 'Los Cuñaditos',
                'phone' => '771 412 9054',
                'opening_hours' => 'Lunes a Viernes - 7:00 AM a 6:00 PM',
                'image' => 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'id' => 3,
                'name' => 'Los Brothers',
                'phone' => '771 685 3321',
                'opening_hours' => 'Lunes a Viernes - 7:00 AM a 6:00 PM',
                'image' => 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'id' => 4,
                'name' => 'Paletería Señor Bigotes',
                'phone' => '771 890 1267',
                'opening_hours' => 'Lunes a Viernes - 7:00 AM a 6:00 PM',
                'image' => 'https://images.unsplash.com/photo-1560008581-09826d1de69e?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'id' => 5,
                'name' => 'Carnitas El Negocio',
                'phone' => '771 305 7789',
                'opening_hours' => 'Lunes a Viernes - 7:00 AM a 6:00 PM',
                'image' => 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=800&q=80',
            ],
        ];

        foreach ($plazaSpots as $spot) {
            $branchRow = [
                'restaurant_id' => 1,
                'location_id' => 1,
                'updated_at' => now(),
            ];

            if (Schema::hasColumn('branches', 'name')) {
                $branchRow['name'] = $spot['name'];
            }
            if (Schema::hasColumn('branches', 'phone')) {
                $branchRow['phone'] = $spot['phone'];
            }
            if (Schema::hasColumn('branches', 'capacity_per_slot')) {
                $branchRow['capacity_per_slot'] = 45;
            }
            if (Schema::hasColumn('branches', 'opening_hours')) {
                $branchRow['opening_hours'] = $spot['opening_hours'];
            }
            if (Schema::hasColumn('branches', 'is_active')) {
                $branchRow['is_active'] = true;
            }

            DB::table('branches')->updateOrInsert(
                ['id' => $spot['id']],
                array_merge($branchRow, ['created_at' => now()])
            );

            // Registro Polimórfico de Imagen
            if (Schema::hasTable('images')) {
                DB::table('images')->updateOrInsert(
                    [
                        'imageable_type' => Branch::class,
                        'imageable_id' => $spot['id'],
                    ],
                    [
                        'url' => $spot['image'],
                        'alt' => $spot['name'].' - Plaza UPP',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }
        }

        // 5. Categorías Gastronómicas
        $catalogCategories = [
            ['id' => 1, 'name' => 'Desayunos & Café', 'branch_id' => 1],
            ['id' => 2, 'name' => 'Comida Corrida & Tacos', 'branch_id' => 2],
            ['id' => 3, 'name' => 'Fast Food & Snacks', 'branch_id' => 3],
            ['id' => 4, 'name' => 'Aguas & Helados', 'branch_id' => 4],
            ['id' => 5, 'name' => 'Especialidades de Cerdo', 'branch_id' => 5],
        ];

        foreach ($catalogCategories as $cat) {
            $catRow = ['updated_at' => now()];

            if (Schema::hasColumn('categories', 'name')) {
                $catRow['name'] = $cat['name'];
            }
            if (Schema::hasColumn('categories', 'branch_id')) {
                $catRow['branch_id'] = $cat['branch_id'];
            }

            DB::table('categories')->updateOrInsert(
                ['id' => $cat['id']],
                array_merge($catRow, ['created_at' => now()])
            );
        }

        // 6. Menú y Platillos Específicos por Local
        $menuCatalogue = [
            // Cafetería Octubre (ID: 1)
            [
                'id' => 1,
                'branch_id' => 1,
                'category_id' => 1,
                'name' => 'Chilaquiles Verdes con Pollo',
                'price' => 55.00,
                'description' => 'Totopos artesanales bañados en salsa verde casera, crema de rancho, queso fresco y pechuga.',
            ],
            [
                'id' => 2,
                'branch_id' => 1,
                'category_id' => 1,
                'name' => 'Café de Olla Tradicional',
                'price' => 25.00,
                'description' => 'Infusión de café de grano con piloncillo, canela en raja y clavo de olor.',
            ],

            // Los Cuñaditos (ID: 2)
            [
                'id' => 3,
                'branch_id' => 2,
                'category_id' => 2,
                'name' => 'Torta Cubana Gigante',
                'price' => 65.00,
                'description' => 'Telera caliente con milanesa, pierna horneada, salchicha, quesillo Oaxaca y aguacate.',
            ],
            [
                'id' => 4,
                'branch_id' => 2,
                'category_id' => 2,
                'name' => 'Comida Corrida Completa',
                'price' => 70.00,
                'description' => 'Sopa del día, arroz o frijoles, guisado principal caliente, tortillas y agua fresca.',
            ],

            // Los Brothers (ID: 3)
            [
                'id' => 5,
                'branch_id' => 3,
                'category_id' => 3,
                'name' => 'Burger Especial con Tocino',
                'price' => 75.00,
                'description' => 'Carne jugosa de res al grill, doble queso cheddar, tocino dorado y papas fritas.',
            ],
            [
                'id' => 6,
                'branch_id' => 3,
                'category_id' => 3,
                'name' => 'Hot Dog Jumbo Hawaiano',
                'price' => 40.00,
                'description' => 'Salchicha de pavo envuelta en tocino con piña asada, queso fundido y aderezos.',
            ],

            // Paletería Señor Bigotes (ID: 4)
            [
                'id' => 7,
                'branch_id' => 4,
                'category_id' => 4,
                'name' => 'Agua Fresca de Fruta 1 Litro',
                'price' => 30.00,
                'description' => 'Elaborada al momento con fruta natural: Horchata con nuez, Jamaica, Maracuyá o Limón chía.',
            ],
            [
                'id' => 8,
                'branch_id' => 4,
                'category_id' => 4,
                'name' => 'Pizza Individual Pepperoni & Queso',
                'price' => 60.00,
                'description' => 'Masa delgada crujiente con salsa pomodoro, mozzarella abundante y pepperoni selecto.',
            ],

            // Carnitas El Negocio (ID: 5)
            [
                'id' => 9,
                'branch_id' => 5,
                'category_id' => 5,
                'name' => 'Orden de Tacos de Carnitas (3 pzas)',
                'price' => 60.00,
                'description' => 'Maciza o surtida dorada al punto en tortilla doble, cilantro, cebolla picada y salsas.',
            ],
            [
                'id' => 10,
                'branch_id' => 5,
                'category_id' => 5,
                'name' => 'Gordita de Chicharrón y Carnitas',
                'price' => 35.00,
                'description' => 'Masa dorada rellena de chicharrón prensado, trozos de carnitas, queso fresco y nopales.',
            ],
        ];

        foreach ($menuCatalogue as $item) {
            $itemRow = ['updated_at' => now()];

            if (Schema::hasColumn('items', 'name')) {
                $itemRow['name'] = $item['name'];
            }
            if (Schema::hasColumn('items', 'price')) {
                $itemRow['price'] = $item['price'];
            }
            if (Schema::hasColumn('items', 'description')) {
                $itemRow['description'] = $item['description'];
            }
            if (Schema::hasColumn('items', 'branch_id')) {
                $itemRow['branch_id'] = $item['branch_id'];
            }
            if (Schema::hasColumn('items', 'restaurant_id')) {
                $itemRow['restaurant_id'] = 1;
            }
            if (Schema::hasColumn('items', 'category_id')) {
                $itemRow['category_id'] = $item['category_id'];
            }

            DB::table('items')->updateOrInsert(
                ['id' => $item['id']],
                array_merge($itemRow, ['created_at' => now()])
            );
        }
    }
}