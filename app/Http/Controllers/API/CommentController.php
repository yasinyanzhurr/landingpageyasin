<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Article;
use App\Http\Resources\CommentResource;
use App\Http\Requests\CommentRequest;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(Article $article)
    {
        $comments = $article->comments()
            ->whereNull('parent_id')
            ->with('replies')
            ->latest()
            ->paginate(10);

        return CommentResource::collection($comments);
    }

    public function store(CommentRequest $request, Article $article)
    {
        $comment = $article->comments()->create([
            'user_id' => auth()->id(),
            'parent_id' => $request->parent_id,
            'content' => $request->content,
            'is_approved' => auth()->user()->can('approve-comments') ? true : false
        ]);

        return new CommentResource($comment);
    }

    public function update(CommentRequest $request, Comment $comment)
    {
        $this->authorize('update', $comment);

        $comment->update([
            'content' => $request->content
        ]);

        return new CommentResource($comment);
    }

    public function destroy(Comment $comment)
    {
        $this->authorize('delete', $comment);

        $comment->delete();

        return response()->json(['message' => 'Comment deleted successfully']);
    }

    public function approve(Comment $comment)
    {
        $this->authorize('approve-comments');

        $comment->update(['is_approved' => true]);

        return new CommentResource($comment);
    }
}
