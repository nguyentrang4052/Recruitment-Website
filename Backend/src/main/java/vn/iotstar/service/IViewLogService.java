package vn.iotstar.service;

import java.util.List;
import vn.iotstar.dto.ProfileViewStatsDTO;

public interface IViewLogService {
    List<ProfileViewStatsDTO> getViewsLast7Days(Integer employerAccountId);
}
