package com.smartcampus.unisync.user.dto;

import com.smartcampus.unisync.common.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRequestDto {

    private String fullName;
    private String email;
    private UserRole role;
}
