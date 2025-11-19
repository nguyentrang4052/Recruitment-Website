package vn.iotstar.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name="JobHistory")
public class NoticeHistory {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
	
	 @ManyToOne
	    @JoinColumn(name = "noticeID")
	    private JobNotice notice;
	    
	    @ManyToOne
	    @JoinColumn(name = "applicantID")
	    private Applicant applicant;
	    
	    @Column(name = "jobCount")
	    private Integer jobCount;
	    
	    @Column(name = "sentDate")
	    private LocalDateTime sentDate;
	    
//	    @Enumerated(EnumType.STRING)
//	    @Column(name = "delivery_type")
//	    private DeliveryType deliveryType;
//	    
//	    @Enumerated(EnumType.STRING)
//	    @Column(name = "status")
//	    private NotificationStatus status;
	    
//	    @Column(name = "error_message", length = 500)
//	    private String errorMessage;

}
