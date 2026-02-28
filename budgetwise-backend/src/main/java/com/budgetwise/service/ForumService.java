package com.budgetwise.service;

import com.budgetwise.model.ForumComment;
import com.budgetwise.model.ForumPost;
import com.budgetwise.model.User;
import com.budgetwise.repository.ForumCommentRepository;
import com.budgetwise.repository.ForumPostRepository;
import com.budgetwise.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ForumService {

    @Autowired
    private ForumPostRepository forumPostRepository;

    @Autowired
    private ForumCommentRepository forumCommentRepository;

    @Autowired
    private UserRepository userRepository;

    public List<ForumPost> getAllPosts() {
        return forumPostRepository.findAllByOrderByCreatedAtDesc();
    }

    public ForumPost createPost(String title, String content, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));
        ForumPost post = new ForumPost(title, content, user);
        return forumPostRepository.save(post);
    }

    public ForumPost likePost(Long postId) {
        ForumPost post = forumPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Error: Post is not found."));
        post.setLikesCount(post.getLikesCount() + 1);
        return forumPostRepository.save(post);
    }

    public List<ForumComment> getCommentsForPost(Long postId) {
        ForumPost post = forumPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Error: Post is not found."));
        return forumCommentRepository.findByPostOrderByCreatedAtAsc(post);
    }

    public ForumComment addComment(Long postId, String content, Long userId) {
        ForumPost post = forumPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Error: Post is not found."));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));

        ForumComment comment = new ForumComment(content, post, user);
        return forumCommentRepository.save(comment);
    }
}
