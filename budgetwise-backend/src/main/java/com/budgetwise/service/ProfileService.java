package com.budgetwise.service;

import com.budgetwise.model.Profile;
import com.budgetwise.model.User;
import com.budgetwise.repository.ProfileRepository;
import com.budgetwise.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

@Service
public class ProfileService {
    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private UserRepository userRepository;

    public Profile getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return profileRepository.findByUser(user)
                .orElse(null); // Or create a default one? Returing null for now to indicate not set.
    }

    @Transactional
    public Profile updateProfile(Long userId, Profile profileDetails) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Profile profile = profileRepository.findByUser(user)
                .orElse(new Profile());

        if (profile.getUser() == null) {
            profile.setUser(user);
        }

        profile.setMonthlyIncome(profileDetails.getMonthlyIncome());
        profile.setCurrentSavings(profileDetails.getCurrentSavings());
        profile.setTargetExpense(profileDetails.getTargetExpense());

        return profileRepository.save(profile);
    }
}
