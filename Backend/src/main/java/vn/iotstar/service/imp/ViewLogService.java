package vn.iotstar.service.imp;
import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.iotstar.dto.ProfileViewStatsDTO;
import vn.iotstar.repository.IViewLogRepository;
import vn.iotstar.service.IViewLogService;

@Service 
@RequiredArgsConstructor
public class ViewLogService implements IViewLogService {

    private final IViewLogRepository repo;

    @Override
    public List<ProfileViewStatsDTO> getViewsLast7Days(Integer employerAccountId) {
        LocalDate from = LocalDate.now().minusDays(6);   // 7 ngày gần nhất
        List<Object[]> raw = repo.countViewsLast7Days(employerAccountId, from);

        
        return raw.stream()
                  .map(arr -> new ProfileViewStatsDTO(
                          vietnameseDay(((String) arr[0]).toLowerCase()),
                          (Long) arr[1]))
                  .toList();
    }

    private String vietnameseDay(String eng) {
    	return switch (eng.trim().toLowerCase()) {
        case "mon" -> "Thứ 2";
        case "tue" -> "Thứ 3";
        case "wed" -> "Thứ 4";
        case "thu" -> "Thứ 5";
        case "fri" -> "Thứ 6";
        case "sat" -> "Thứ 7";
        case "sun" -> "CN";
        default -> eng;
    };
    }
}