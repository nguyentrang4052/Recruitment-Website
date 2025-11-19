package vn.iotstar.service;

import vn.iotstar.dto.InterviewMailRequestDTO;

public interface IInterviewService {
	
    void sendInterviewEmail(InterviewMailRequestDTO request);
    
    void approveAndScheduleInterview(InterviewMailRequestDTO request);
}