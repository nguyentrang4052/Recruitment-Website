package vn.iotstar.service;

import org.springframework.data.domain.Page;
import vn.iotstar.dto.ActiveJobDTO;
import vn.iotstar.dto.JobDetailDTO;

public interface IEmployerJobService {
    Page<ActiveJobDTO> getActiveJobs(Integer employerAccountId, int page, int size);
    
//    ActiveJobDTO getJobDetail(Integer jobId);
    
    JobDetailDTO getJobDetail(Integer jobId);
    
    JobDetailDTO updateJob(Integer jobId, Integer employerAccountId, JobDetailDTO updateDTO);
    
    void deleteJob(Integer jobId, Integer employerAccountId);
}