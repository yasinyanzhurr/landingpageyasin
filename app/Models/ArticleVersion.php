<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ArticleVersion extends Model
{
    protected $fillable = [
        'article_id',
        'user_id',
        'title',
        'content',
        'thumbnail',
        'tags',
        'version_note'
    ];

    protected $casts = [
        'tags' => 'array'
    ];

    public function article()
    {
        return $this->belongsTo(Article::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
