package vn.iotstar.entity;

import java.io.Serializable;
import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "employer_package_limit")
public class EmployerPackageLimit implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "employer_id", nullable = false, unique = true)
    private Employer employer;

    @Column(name = "max_posts")
    private Integer maxPosts;

    @Column(name = "posts_left")
    private Integer postsLeft;

    @Column(name = "max_cv_views")
    private Integer maxCvViews;

    @Column(name = "cv_views_left")
    private Integer cvViewsLeft;

    @Column(name = "support_priority_days")
    private Integer supportPriorityDays;

    @Column(name = "has_1on1_consult")
    private Boolean has1on1Consult = false;

    @Column(name = "has_email_support")
    private Boolean hasEmailSupport = false;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;
}