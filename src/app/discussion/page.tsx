
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { NewPostForm } from '@/components/discussion/new-post-form';
import { PostCard, type Post } from '@/components/discussion/post-card';
import { Separator } from '@/components/ui/separator';

const DISCUSSION_STORAGE_KEY = 'domnam-discussion-posts';

const initialPosts: Post[] = [
  {
    id: 'demo-post-1',
    author: {
      username: 'Admin',
      profilePicture: '',
    },
    title: 'Welcome to the Domnam Community!',
    content: 'This is the discussion board for all things related to smart farming. Feel free to ask questions, share your tips, or show off your farm layouts!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    replies: [
      {
        id: 'demo-reply-1',
        author: {
          username: 'FarmManager',
          profilePicture: '',
        },
        content: "Great to be here! I'm excited to learn from everyone.",
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
    title: 'Best way to deal with tomato blight?',
    content: "I've noticed some of my tomato plants are showing signs of early blight. What are your best organic treatment methods?",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    replies: [],
  },
];

export default function DiscussionPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
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
  }, []);

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
        <h1 className="text-3xl font-headline font-bold">Community Discussion</h1>
        <p className="text-muted-foreground">
          Ask questions, share tips, and connect with other users.
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
            <h3 className="text-xl font-semibold">No discussions yet.</h3>
            <p>Be the first to start a conversation!</p>
          </div>
        )}
      </div>
    </div>
  );
}
