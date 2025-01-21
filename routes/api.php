// routes/api.php
<?php

use App\Http\Controllers\API\ArticleController;
use App\Http\Controllers\API\AuthController;

// Auth Routes
Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Admin Routes
    Route::middleware(['role:admin'])->prefix('admin')->group(function () {
        Route::get('/dashboard', function () {
            return response()->json(['message' => 'Admin Dashboard']);
        });
    });

    // Editor Routes
    Route::middleware(['role:editor'])->prefix('editor')->group(function () {
        Route::get('/dashboard', function () {
            return response()->json(['message' => 'Editor Dashboard']);
        });
    });

    Route::apiResource('articles', ArticleController::class);
    Route::post('articles/draft', [ArticleController::class, 'saveDraft']);
    Route::post('articles/{article}/submit', [ArticleController::class, 'submitForReview']);

    // Version history routes
    Route::get('articles/{article}/versions', [ArticleController::class, 'versions']);
    Route::post('articles/{article}/versions/{version}/restore', [ArticleController::class, 'restoreVersion']);

    // Notification routes
    Route::get('notifications', [NotificationController::class, 'index']);
    Route::post('notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
});
