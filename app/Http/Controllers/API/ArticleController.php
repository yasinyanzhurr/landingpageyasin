<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use App\Http\Resources\ArticleResource;
use App\Http\Requests\ArticleRequest;
use Illuminate\Support\Facades\Storage;;

class ArticleController extends Controller
{
    public function index(Request $request)
    {
        $articles = Article::query()
            ->when($request->status, function ($query, $status) {
                return $query->where('status', $status);
            })
            ->when($request->category_id, function ($query, $categoryId) {
                return $query->where('category_id', $categoryId);
            })
            ->when($request->search, function ($query, $search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('content', 'like', "%{$search}%");
                });
            })
            ->when(auth()->user()->role === 'writer', function ($query) {
                return $query->byUser(auth()->id());
            })
            ->with(['user', 'category'])
            ->latest()
            ->paginate($request->per_page ?? 10);

        return ArticleResource::collection($articles);
    }

    public function store(ArticleRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = auth()->id();

        if ($request->hasFile('thumbnail')) {
            $data['thumbnail'] = $this->uploadThumbnail($request->file('thumbnail'));
        }

        $article = Article::create($data);

        return new ArticleResource($article);
    }

    public function show(Article $article)
    {
        $this->authorize('view', $article);

        $article->load(['user', 'category']);
        return new ArticleResource($article);
    }

    public function update(ArticleRequest $request, Article $article)
    {
        $this->authorize('update', $article);

        $data = $request->validated();

        if ($request->hasFile('thumbnail')) {
            // Delete old thumbnail
            if ($article->thumbnail) {
                Storage::delete($article->thumbnail);
            }
            $data['thumbnail'] = $this->uploadThumbnail($request->file('thumbnail'));
        }

        $article->update($data);

        return new ArticleResource($article);
    }

    public function destroy(Article $article)
    {
        $this->authorize('delete', $article);

        if ($article->thumbnail) {
            Storage::delete($article->thumbnail);
        }

        $article->delete();

        return response()->json(['message' => 'Article deleted successfully']);
    }

    public function saveDraft(ArticleRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = auth()->id();
        $data['status'] = 'draft';

        if ($request->hasFile('thumbnail')) {
            $data['thumbnail'] = $this->uploadThumbnail($request->file('thumbnail'));
        }

        $article = Article::create($data);

        return new ArticleResource($article);
    }

    public function submitForReview(Article $article)
    {
        $this->authorize('submit', $article);

        $article->update([
            'status' => 'pending'
        ]);

        return new ArticleResource($article);
    }

    private function uploadThumbnail($file)
    {
        return $file->store('articles/thumbnails', 'public');
    }

    public function versions(Article $article)
    {
        $this->authorize('view', $article);

        $versions = $article->versions()
            ->with('user')
            ->get()
            ->map(function ($version) {
                // Calculate changes
                $version->changes = $this->calculateChanges($version);
                return $version;
            });

        return response()->json($versions);
    }

    public function restoreVersion(Article $article, ArticleVersion $version)
    {
        $this->authorize('update', $article);

        // Save current state as a new version
        $article->createVersion('Auto-saved before version restore');

        // Restore the selected version
        $article->update([
            'title' => $version->title,
            'content' => $version->content,
            'thumbnail' => $version->thumbnail,
            'tags' => $version->tags
        ]);

        return new ArticleResource($article);
    }

    private function calculateChanges(ArticleVersion $version)
    {
        $previousVersion = $version->article
            ->versions()
            ->where('created_at', '<', $version->created_at)
            ->first();

        if (!$previousVersion) {
            return null;
        }

        return [
            'title' => $version->title !== $previousVersion->title,
            'content' => $version->content !== $previousVersion->content,
            'thumbnail' => $version->thumbnail !== $previousVersion->thumbnail,
            'tags' => $version->tags !== $previousVersion->tags
        ];
    }

}
