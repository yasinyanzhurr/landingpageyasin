<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Article extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'slug',
        'content',
        'thumbnail',
        'status',
        'tags',
        'views',
        'published_at'
    ];

    protected $casts = [
        'tags' => 'array',
        'published_at' => 'datetime',
    ];

    // Auto-generate slug when title is set
    public function setTitleAttribute($value)
    {
        $this->attributes['title'] = $value;
        $this->attributes['slug'] = Str::slug($value);
    }

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // Local Scopes
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeDrafts($query)
    {
        return $query->where('status', 'draft');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function versions()
    {
        return $this->hasMany(ArticleVersion::class)->orderBy('created_at', 'desc');
    }

    public function createVersion($note = null)
    {
        return $this->versions()->create([
            'user_id' => auth()->id(),
            'title' => $this->title,
            'content' => $this->content,
            'thumbnail' => $this->thumbnail,
            'tags' => $this->tags,
            'version_note' => $note
        ]);
    }

}
