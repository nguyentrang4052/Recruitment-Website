package vn.iotstar.service;

import java.util.List;
import java.util.Optional;

import vn.iotstar.dto.RecruitmentNewsDTO;
import vn.iotstar.entity.RecruitmentNews;

public interface IRecruitmentNewsService {
    RecruitmentNews save(RecruitmentNewsDTO dto);
    List<RecruitmentNews> findAll();
    Optional<RecruitmentNews> findById(Integer id);
    RecruitmentNews update(Integer id, RecruitmentNewsDTO dto);
    void delete(Integer id);
}
