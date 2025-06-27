"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { NewPostForm } from '@/components/discussion/new-post-form';
import { PostCard, type Post } from '@/components/discussion/post-card';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/context/language-context';

const DISCUSSION_STORAGE_KEY = 'domnam-discussion-posts';

export default function DiscussionPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const initialPosts: Post[] = [
      {
        id: 'demo-post-1',
        author: {
          username: 'Admin',
          profilePicture: '',
        },
        title: t('welcome_post_title'),
        content: t('welcome_post_content'),
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        replies: [
          {
            id: 'demo-reply-1',
            author: {
              username: 'FarmManager',
              profilePicture: '',
            },
            content: t('welcome_reply_content'),
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
          },
        ],
      },
      {
        id: 'demo-post-2',
        author: {
          username: 'TomatoKing',
          profilePicture: '',
        },
        title: t('tomato_post_title'),
        content: t('tomato_post_content'),
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        replies: [],
      },
    ];

    try {
      const storedPosts = localStorage.getItem(DISCUSSION_STORAGE_KEY);
      if (storedPosts) {
        setPosts(JSON.parse(storedPosts));
      } else {
        setPosts(initialPosts);
      }
    } catch (error) {
      console.error("Failed to parse posts from localStorage", error);
      setPosts(initialPosts);
    }
    setIsMounted(true);
  }, [t]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(DISCUSSION_STORAGE_KEY, JSON.stringify(posts));
    }
  }, [posts, isMounted]);

  const handleCreatePost = (title: string, content: string) => {
    if (!user) return;

    const newPost: Post = {
      id: crypto.randomUUID(),
      author: {
        username: user.username,
        profilePicture: user.profilePicture,
      },
      title,
      content,
      timestamp: new Date().toISOString(),
      replies: [],
    };

    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const handleReply = (postId: string, replyContent: string) => {
    if (!user) return;

    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          const newReply = {
            id: crypto.randomUUID(),
            author: {
              username: user.username,
              profilePicture: user.profilePicture,
            },
            content: replyContent,
            timestamp: new Date().toISOString(),
          };
          return { ...post, replies: [...post.replies, newReply] };
        }
        return post;
      })
    );
  };
  
  if (!isMounted) {
    return null; // or a loading skeleton
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold">{t('discussion_title')}</h1>
        <p className="text-muted-foreground">
          {t('discussion_description')}
        </p>
      </div>

      <NewPostForm onPostCreate={handleCreatePost} />

      <Separator />

      <div className="space-y-6">
        {posts.length > 0 ? (
          posts.map(post => (
            <PostCard key={post.id} post={post} onReply={handleReply} />
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <h3 className="text-xl font-semibold">{t('no_discussions_title')}</h3>
            <p>{t('no_discussions_description')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
