<?php

// app/Notifications/NewCommentNotification.php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;

class NewCommentNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $comment;

    public function __construct($comment)
    {
        $this->comment = $comment;
    }

    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }

    public function toArray($notifiable)
    {
        return [
            'comment_id' => $this->comment->id,
            'article_id' => $this->comment->article_id,
            'user_id' => $this->comment->user_id,
            'user_name' => $this->comment->user->name,
            'content' => substr($this->comment->content, 0, 100),
            'type' => 'new_comment'
        ];
    }

    public function toBroadcast($notifiable)
    {
        return [
            'id' => $this->id,
            'data' => $this->toArray($notifiable)
        ];
    }
}
