package vn.iotstar.entity;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "TransactionDetail")
public class TransactionDetail implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transDetailID")
    private Integer transDetailID;

    @OneToOne
    @JoinColumn(name = "transactionID", referencedColumnName = "transactionID")
    private Transaction transaction;

    // 1 detail có nhiều package
    @OneToMany(mappedBy = "transactionDetail", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PostPackage> postPackages = new ArrayList<>();

    @Column(name = "expiry_date")
    private LocalDate expiryDate;
}