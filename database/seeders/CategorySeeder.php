<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run()
    {
        $categories = [
            [
                'name' => 'Technology',
                'description' => 'Articles about technology and innovation'
            ],
            [
                'name' => 'Programming',
                'description' => 'Programming tutorials and tips'
            ],
            [
                'name' => 'Web Development',
                'description' => 'Web development related articles'
            ],
            [
                'name' => 'Mobile Development',
                'description' => 'Mobile app development articles'
            ]
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
