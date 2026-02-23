package com.budgetwise.controller;

import com.budgetwise.model.Profile;
import com.budgetwise.service.ProfileService;
import com.budgetwise.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @GetMapping
    public ResponseEntity<Profile> getProfile(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        Profile profile = profileService.getProfile(userDetails.getId());
        return ResponseEntity.ok(profile);
    }

    @PostMapping
    public ResponseEntity<Profile> updateProfile(@AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody Profile profile) {
        Profile updatedProfile = profileService.updateProfile(userDetails.getId(), profile);
        return ResponseEntity.ok(updatedProfile);
    }
}
