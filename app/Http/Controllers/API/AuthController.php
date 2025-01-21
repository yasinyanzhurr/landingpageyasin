<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if (Auth::attempt($request->only('email', 'password'))) {
            $user = Auth::user();
            $token = $user->createToken('auth-token')->plainTextToken;

            // Tentukan redirect berdasarkan role
            $redirect = $this->getRedirectByRole($user->role);

            return response()->json([
                'success' => true,
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role
                ],
                'redirect' => $redirect,
                'message' => 'Login successful'
            ]);
        }

        throw ValidationException::withMessages([
            'email' => ['The provided credentials are incorrect.']
        ]);
    }

    public function logout(Request $request)
    {
        try {
            // Revoke the token that was used to authenticate the current request
            if ($request->user()) {
                $request->user()->currentAccessToken()->delete();
            }

            // Clear session
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();


            return response()->json([
                'success' => true,
                'message' => 'Successfully logged out'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error during logout: ' . $e->getMessage()
            ], 500);
        }
    }

    public function user(Request $request)
    {
        return response()->json([
            'success' => true,
            'user' => $request->user()
        ]);
    }

    private function getRedirectByRole($role)
    {
        $redirects = [
            'admin' => '/admin/dashboard',
            'editor' => '/editor/dashboard',
            'writer' => '/writer/dashboard',
            'user' => '/dashboard'
        ];

        return $redirects[$role] ?? '/dashboard';
    }
}

