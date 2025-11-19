package vn.iotstar.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data @AllArgsConstructor
public class ProfileViewStatsDTO {
    private String day;         
    private long views;          
}