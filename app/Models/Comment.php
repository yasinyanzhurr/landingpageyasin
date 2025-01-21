<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Notification;

class Comment extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'article_id',
        'user_id',
        'parent_id',
        'content',
        'is_approved'
    ];

    protected $with = ['user'];

    protected static function boot()
    {
        parent::boot();

        static::created(function ($comment) {
            // Notify article author
            $article = $comment->article;
            if ($article->user_id !== $comment->user_id) {
                $article->user->notify(new NewCommentNotification($comment));
            }

            // If this is a reply, notify parent comment author
            if ($comment->parent_id) {
                $parentComment = Comment::find($comment->parent_id);
                if ($parentComment->user_id !== $comment->user_id) {
                    $parentComment->user->notify(new NewCommentNotification($comment));
                }
            }
        });
    }


    public function article()
    {
        return $this->belongsTo(Article::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function parent()
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    public function replies()
    {
        return $this->hasMany(Comment::class, 'parent_id')->with('replies');
    }
}


