package vn.iotstar.service.imp;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.iotstar.dto.PostPackageDTO;
import vn.iotstar.entity.PostPackage;
import vn.iotstar.repository.IPostPackageRepository;
import vn.iotstar.service.IPostPackageService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostPackageService implements IPostPackageService {

    private final IPostPackageRepository repo;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public List<PostPackageDTO> getAllPackages() {
        return repo.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PostPackageDTO getPackageById(Integer id) {
        return repo.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Gói không tồn tại"));
    }

    @Override
    public PostPackageDTO createPackage(PostPackageDTO dto) {
        PostPackage entity = toEntity(dto);
        entity.setDuration(formatDuration(dto.getDuration()));   // 30 → "30 Ngày"
        return toDTO(repo.save(entity));
    }

    @Override
    public PostPackageDTO updatePackage(Integer id, PostPackageDTO dto) {
        PostPackage pkg = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Gói không tồn tại"));

        pkg.setPackageName(dto.getPackageName());
        pkg.setCategory(dto.getCategory());
        pkg.setPrice(dto.getPrice());
        pkg.setDuration(formatDuration(dto.getDuration()));      // 90 → "90 Ngày"
        pkg.setDescription(dto.getDescription());
        pkg.setFeatures(toJson(dto.getFeatures()));
        pkg.setTaxRate(dto.getTaxRate());
        pkg.setIsRecommended(dto.getIsRecommended());
        pkg.setIsHidden(dto.getIsHidden());
        return toDTO(repo.save(pkg));
    }
    
    private String formatDuration(Object dur) {
        if (dur == null) return null;
        String str = dur.toString().replaceAll("\\D+", ""); // chỉ giữ số
        return str + " Ngày";
    }

    @Override
    public void deletePackage(Integer id) {
        if (!repo.existsById(id)) throw new RuntimeException("Gói không tồn tại");
        repo.deleteById(id);
    }

    @Override
    public boolean toggleHidden(Integer id) {
        PostPackage pkg = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Gói không tồn tại"));
        boolean current = pkg.getIsHidden() != null ? pkg.getIsHidden() : false;
        pkg.setIsHidden(!current);
        repo.save(pkg);
        return !current;
    }

 
    private PostPackageDTO toDTO(PostPackage entity) {
        PostPackageDTO dto = new PostPackageDTO();
        dto.setPackageID(entity.getPackageID());
        dto.setPackageName(entity.getPackageName());
        dto.setCategory(entity.getCategory());
        dto.setPrice(entity.getPrice());
        dto.setDuration(extractDay(entity.getDuration())); // "90 Ngày" → 90
        dto.setDescription(entity.getDescription());
        dto.setFeatures(parseJsonList(entity.getFeatures()));
        dto.setTaxRate(entity.getTaxRate());
        dto.setIsRecommended(entity.getIsRecommended());
        dto.setIsHidden(entity.getIsHidden());
        return dto;
    }

    private String extractDay(String durationText) {
        if (durationText == null) return "0";
        try {
            return durationText.replaceAll("\\D+", ""); // "90 Ngày" → "90"
        } catch (Exception ex) {
            return "0";
        }
    }

    private PostPackage toEntity(PostPackageDTO dto) {
        PostPackage entity = new PostPackage();
        entity.setPackageName(dto.getPackageName());
        entity.setCategory(dto.getCategory());
        entity.setPrice(dto.getPrice());
        entity.setDuration(dto.getDuration());
        entity.setDescription(dto.getDescription());
        entity.setFeatures(toJson(dto.getFeatures()));
        entity.setTaxRate(dto.getTaxRate());
        entity.setIsRecommended(dto.getIsRecommended());
        entity.setIsHidden(dto.getIsHidden());
        return entity;
    }

    private List<String> parseJsonList(String json) {
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            return List.of();
        }
    }

    private String toJson(List<String> list) {
        try {
            return objectMapper.writeValueAsString(list);
        } catch (Exception e) {
            return "[]";
        }
    }
    
    
    
}