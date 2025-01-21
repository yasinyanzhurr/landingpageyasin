<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Create admin user
        User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'email_verified_at' => now()
        ]);

        // Create editor user
        User::create([
            'name' => 'Editor',
            'email' => 'editor@example.com',
            'password' => Hash::make('password123'),
            'role' => 'editor',
            'email_verified_at' => now()
        ]);
    }
}
