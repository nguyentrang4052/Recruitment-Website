package vn.iotstar.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

@Data
public class CassoResponseDTO {
    private int error;
    private String message;
    private CassoData data;
    
    @Data
    public static class CassoData {
        private int pageSize;
        private int pageIndex;
        private int pageTotal;
        private List<CassoTransaction> records;
    }
    
    @Data
    public static class CassoTransaction {
        private String id;
        private String tid;
        private String description;
        private int amount;
        private String when;
        
        @JsonProperty("bank_sub_acc_id")
        private String bankSubAccId;
    }
}