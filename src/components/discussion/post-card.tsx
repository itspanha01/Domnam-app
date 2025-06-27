"use client";

import { useState } from "react";
import { formatDistanceToNow } from 'date-fns';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Separator } from "../ui/separator";
import { MessageSquare, CornerDownRight, Send } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useLanguage } from "@/context/language-context";

interface Author {
  username: string;
  profilePicture?: string;
}
interface Reply {
  id: string;
  author: Author;
  content: string;
  timestamp: string;
}

export interface Post {
  id: string;
  author: Author;
  title: string;
  content: string;
  timestamp: string;
  replies: Reply[];
}

interface PostCardProps {
  post: Post;
  onReply: (postId: string, replyContent: string) => void;
}

const replySchema = z.object({
  reply: z.string().min(1, "Reply cannot be empty."),
});


const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : '?';
}

function ReplyCard({ reply }: { reply: Reply }) {
    const { t } = useLanguage();
    return (
        <div className="flex gap-3">
             <Avatar className="h-8 w-8">
                <AvatarImage src={reply.author.profilePicture} alt={`@${reply.author.username}`} />
                <AvatarFallback>{getInitials(reply.author.username)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{reply.author.username}</p>
                    <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(reply.timestamp), { addSuffix: true })}
                    </p>
                </div>
                <p className="text-sm text-foreground/90 whitespace-pre-wrap">{reply.content}</p>
            </div>
        </div>
    )
}

export function PostCard({ post, onReply }: PostCardProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const form = useForm<z.infer<typeof replySchema>>({
    resolver: zodResolver(replySchema),
    defaultValues: {
      reply: "",
    },
  });

  function onSubmit(values: z.infer<typeof replySchema>) {
    onReply(post.id, values.reply);
    form.reset();
  }

  const replyText = post.replies.length === 1 
    ? t('reply_count', { count: post.replies.length.toString() })
    : t('replies_count', { count: post.replies.length.toString() });

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10">
             <AvatarImage src={post.author.profilePicture} alt={`@${post.author.username}`} />
            <AvatarFallback>{getInitials(post.author.username)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-bold font-headline">{post.title}</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <p>{t('post_by')} <span className="font-medium text-foreground">{post.author.username}</span></p>
              <span>&middot;</span>
              <p>{formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-foreground/90 whitespace-pre-wrap">{post.content}</p>
      </CardContent>
      <CardFooter className="flex-col items-start gap-4">
        <div className="w-full space-y-4">
            {post.replies.length > 0 && <Separator />}
            <div className="flex items-center text-sm font-medium text-muted-foreground gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>{replyText}</span>
            </div>
            {post.replies.length > 0 && (
                <div className="pl-6 border-l-2 ml-4 space-y-4">
                    {post.replies.map(reply => (
                        <ReplyCard key={reply.id} reply={reply} />
                    ))}
                </div>
            )}
        </div>
        <Separator />
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex items-start gap-3 pt-2">
                {user && (
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={user.profilePicture} alt={`@${user.username}`} />
                        <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
                    </Avatar>
                )}
                <div className="flex-1">
                     <FormField
                        control={form.control}
                        name="reply"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea
                                        placeholder={t('write_reply_placeholder')}
                                        className="min-h-[20px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                </div>
                <Button type="submit" size="icon" disabled={form.formState.isSubmitting}>
                    <Send className="h-4 w-4" />
                </Button>
            </form>
         </Form>
      </CardFooter>
    </Card>
  );
}
