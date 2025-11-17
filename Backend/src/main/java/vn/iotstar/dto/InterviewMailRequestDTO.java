package vn.iotstar.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class InterviewMailRequestDTO {
    private Integer applicantId;
    private Integer recruitmentNewsId;
    private LocalDate interviewDate;
    private LocalTime interviewTime;
    private String interviewType;
    private String note;
    private String email;
    private String applicantName;
    private String companyName;
}