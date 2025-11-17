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

    private PostPackageDTO toDTO(PostPackage entity) {
        PostPackageDTO dto = new PostPackageDTO();
        dto.setPackageID(entity.getPackageID());
        dto.setPackageName(entity.getPackageName());
        dto.setCategory(entity.getCategory());
        dto.setPrice(entity.getPrice());
        dto.setDuration(entity.getDuration());
        dto.setDescription(entity.getDescription());
        dto.setFeatures(parseJsonList(entity.getFeatures()));
        dto.setTaxRate(entity.getTaxRate());
        dto.setIsRecommended(entity.getIsRecommended() != null ? entity.getIsRecommended() : false);
        return dto;
    }

    private List<String> parseJsonList(String json) {
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            return List.of();
        }
    }
}