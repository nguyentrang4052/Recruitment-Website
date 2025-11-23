package vn.iotstar.entity;

import java.io.Serializable;
import java.math.BigDecimal;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "PostPackage")
public class PostPackage implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "packageID")
    private Integer packageID;

    @Column(name = "packageName", nullable = false, length = 255)
    private String packageName;

    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "duration", length = 50)
    private String duration;

    @Column(name = "category", length = 255)
    private String category;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "features", columnDefinition = "TEXT")
    private String features;

    @Column(name = "tax_rate", precision = 4, scale = 2)
    private BigDecimal taxRate;

    @Column(name = "is_hidden")
    private Boolean isHidden = false;

    @Column(name = "is_recommended")
    private Boolean isRecommended = false;

    // QUAN HỆ 1-n với TransactionDetail
    @ManyToOne
    @JoinColumn(name = "trans_detail_id")
    private TransactionDetail transactionDetail;
}