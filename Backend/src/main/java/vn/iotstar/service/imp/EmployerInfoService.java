package vn.iotstar.service.imp;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import vn.iotstar.dto.EmployerInfoDTO;
import vn.iotstar.entity.Employer;
import vn.iotstar.entity.Account;
import vn.iotstar.repository.IEmployerRegisterRepository;
import vn.iotstar.repository.IAccountRepository;
import vn.iotstar.service.IEmployerInfoService;

import org.springframework.beans.factory.InitializingBean;

import java.io.InputStream;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class EmployerInfoService implements IEmployerInfoService, InitializingBean {

    @Autowired
    private IAccountRepository accountRepository;

    @Autowired
    private IEmployerRegisterRepository employerRegisterRepository;

    private Map<String, String> provinceMap; 
    private Map<String, String> wardMap;    

    @Override
    public void afterPropertiesSet() throws Exception {
        loadProvincesAndWards();
    }

    private void loadProvincesAndWards() throws Exception {
        ObjectMapper mapper = new ObjectMapper();

        // Load provinces.json
        InputStream provStream = getClass().getResourceAsStream("/data/provinces.json");
        List<Map<String, Object>> provinces = mapper.readValue(provStream, new TypeReference<>() {});
        provinceMap = provinces.stream().collect(Collectors.toMap(
                p -> (String)p.get("code"),
                p -> (String)p.get("name")
        ));

        // Load wards.json
        InputStream wardStream = getClass().getResourceAsStream("/data/wards.json");
        List<Map<String, Object>> wards = mapper.readValue(wardStream, new TypeReference<>() {});
        wardMap = wards.stream().collect(Collectors.toMap(
                w -> (String)w.get("code"),
                w -> (String)w.get("name")
        ));
    }

    @Override
    public EmployerInfoDTO getEmployerInfoByUsername(String username) {
        Account account = accountRepository.findByUsername(username);
        if (account == null)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Tài khoản không tồn tại");

        Employer employer = employerRegisterRepository.findByAccount(account);
        if (employer == null)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Công ty chưa cập nhật thông tin");

        EmployerInfoDTO dto = new EmployerInfoDTO();
        dto.setEmployerID(employer.getEmployerID());
        dto.setEmployerName(employer.getEmployerName());
        dto.setFullName(employer.getFullName());
        dto.setRepresentative(employer.getRepresentative());
        dto.setPhone(employer.getPhone());
        dto.setCompanyWebsite(employer.getCompanyWebsite());
        dto.setCompanyProfile(employer.getCompanyProfile());
        dto.setCompanyLogo(employer.getCompanyLogo());
        dto.setCompanyImage(employer.getCompanyImage());
        dto.setCompanySize(employer.getCompanySize());

        parseAddressToDTO(employer.getAddress(), dto);

        if(dto.getRegisteredWard() != null)
            dto.setRegisteredWard(wardMap.getOrDefault(dto.getRegisteredWard(), dto.getRegisteredWard()));
        if(dto.getRegisteredProvince() != null)
            dto.setRegisteredProvince(provinceMap.getOrDefault(dto.getRegisteredProvince(), dto.getRegisteredProvince()));

        return dto;
    }

    @Override
    public String updateEmployerInfo(EmployerInfoDTO dto) {
        Employer employer = employerRegisterRepository.findById(dto.getEmployerID())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Công ty không tồn tại"));

        if(dto.getEmployerName() != null) employer.setEmployerName(dto.getEmployerName());
        if(dto.getFullName() != null) employer.setFullName(dto.getFullName());
        if(dto.getRepresentative() != null) employer.setRepresentative(dto.getRepresentative());
        if(dto.getPhone() != null) employer.setPhone(dto.getPhone());
        if(dto.getCompanyWebsite() != null) employer.setCompanyWebsite(dto.getCompanyWebsite());
        if(dto.getCompanyProfile() != null) employer.setCompanyProfile(dto.getCompanyProfile());
        if(dto.getCompanyLogo() != null) employer.setCompanyLogo(dto.getCompanyLogo());
        if(dto.getCompanyImage() != null) employer.setCompanyImage(dto.getCompanyImage());
        if(dto.getCompanySize() != null) employer.setCompanySize(dto.getCompanySize());

        if(dto.getRegisteredWard() != null)
            dto.setRegisteredWard(wardMap.getOrDefault(dto.getRegisteredWard(), dto.getRegisteredWard()));
        if(dto.getRegisteredProvince() != null)
            dto.setRegisteredProvince(provinceMap.getOrDefault(dto.getRegisteredProvince(), dto.getRegisteredProvince()));

        employer.setAddress(buildFullAddress(dto));
        employerRegisterRepository.save(employer);

        return "Cập nhật thông tin công ty thành công!";
    }

    private void parseAddressToDTO(String address, EmployerInfoDTO dto) {
        if(address == null || address.isEmpty()) return;

        String[] parts = address.split(",");
        int n = parts.length;

        if(n >= 2) {
            dto.setRegisteredProvince(parts[n - 1].trim());
            dto.setRegisteredWard(parts[n - 2].trim());

            StringBuilder detailed = new StringBuilder();
            for(int i = 0; i < n - 2; i++) {
                if(i > 0) detailed.append(", ");
                detailed.append(parts[i].trim());
            }
            dto.setDetailedAddress(detailed.toString());
        } else if(n == 1) {
            dto.setDetailedAddress("");
            dto.setRegisteredWard(parts[0].trim());
            dto.setRegisteredProvince("");
        }
    }

    private String buildFullAddress(EmployerInfoDTO dto) {
        return Stream.of(dto.getDetailedAddress(), dto.getRegisteredWard(), dto.getRegisteredProvince())
                     .filter(s -> s != null && !s.isEmpty())
                     .collect(Collectors.joining(", "));
    }
}
