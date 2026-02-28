package com.budgetwise.controller;

import com.budgetwise.model.ForumComment;
import com.budgetwise.model.ForumPost;
import com.budgetwise.security.services.UserDetailsImpl;
import com.budgetwise.service.ForumService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/forum")
public class ForumController {

    @Autowired
    private ForumService forumService;

    @GetMapping("/posts")
    public ResponseEntity<List<ForumPost>> getAllPosts() {
        return ResponseEntity.ok(forumService.getAllPosts());
    }

    @PostMapping("/posts")
    public ResponseEntity<ForumPost> createPost(
            @RequestBody Map<String, String> payload,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        String title = payload.get("title");
        String content = payload.get("content");
        ForumPost post = forumService.createPost(title, content, userDetails.getId());
        return ResponseEntity.ok(post);
    }

    @PostMapping("/posts/{postId}/like")
    public ResponseEntity<ForumPost> likePost(@PathVariable Long postId) {
        return ResponseEntity.ok(forumService.likePost(postId));
    }

    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<List<ForumComment>> getComments(@PathVariable Long postId) {
        return ResponseEntity.ok(forumService.getCommentsForPost(postId));
    }

    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<ForumComment> addComment(
            @PathVariable Long postId,
            @RequestBody Map<String, String> payload,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        String content = payload.get("content");
        ForumComment comment = forumService.addComment(postId, content, userDetails.getId());
        return ResponseEntity.ok(comment);
    }
}
