<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Article;

class ArticlePolicy
{
    public function view(User $user, Article $article)
    {
        return $user->id === $article->user_id ||
               in_array($user->role, ['admin', 'editor']);
    }

    public function update(User $user, Article $article)
    {
        return $user->id === $article->user_id &&
               in_array($article->status, ['draft', 'rejected']);
    }

    public function delete(User $user, Article $article)
    {
        return $user->id === $article->user_id ||
               $user->role === 'admin';
    }

    public function submit(User $user, Article $article)
    {
        return $user->id === $article->user_id &&
               $article->status === 'draft';
    }
}


