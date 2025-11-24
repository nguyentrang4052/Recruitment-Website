package vn.iotstar.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class PostPackageDTO {
    private Integer packageID;
    private String packageName;
    private String category;
    private BigDecimal price;
    private String duration;
    private String description;
//    private List<String> features;
    private BigDecimal taxRate;
    private Boolean isRecommended;
    private Boolean isHidden;
    private Integer maxPosts;
    private Integer maxCvViews;
    private Integer supportPriorityDays;
    private Boolean has1on1Consult;
    private Boolean hasEmailSupport;
}