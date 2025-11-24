package vn.iotstar.service.imp;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.iotstar.dto.RevenueByPackageDTO;
import vn.iotstar.dto.RevenuePerMonthDTO;
import vn.iotstar.dto.RevenueResponseDTO;
import vn.iotstar.dto.RevenueSummaryDTO;
import vn.iotstar.repository.ITransactionRepository;

@Service
@RequiredArgsConstructor
public class RevenueService {

    private final ITransactionRepository transactionRepository;

    public RevenueResponseDTO getRevenue(int year) {
        List<RevenuePerMonthDTO> monthly = transactionRepository.getRevenuePerMonth(year);
        List<RevenueByPackageDTO> byPkg = transactionRepository.getRevenueByPackage(year);
        RevenueSummaryDTO summary = transactionRepository.getSummary(year);

     
        double total = summary.getTotalRevenue();
        byPkg.forEach(d -> {
            d.setPercentage(total == 0 ? 0 : (d.getRevenue() * 100.0 / total));
            d.setColor(pickColor(d.getPackageName())); 
        });

 
        if (monthly.size() >= 2) {
            RevenuePerMonthDTO last = monthly.get(monthly.size() - 1);
            RevenuePerMonthDTO prev = monthly.get(monthly.size() - 2);
            summary.setMonthlyGrowth(prev.getRevenue() == 0 ? 0 :
                (last.getRevenue() - prev.getRevenue()) * 100.0 / prev.getRevenue());
        }

        return new RevenueResponseDTO(summary, monthly, byPkg);
    }

    private String pickColor(String name) {
        return switch (name) {
            case "Gói Basic" -> "#667eea";
            case "Gói Premium" -> "#764ba2";
            case "Gói Standard" -> "#f093fb";
            case "Gói Enterprise" -> "#4facfe";
            default -> "#10b981";
        };
    }
}
