package vn.iotstar.controller;

import org.springframework.web.bind.annotation.*;
import vn.iotstar.dto.PostPackageDTO;
import vn.iotstar.service.IPostPackageService;

import java.util.List;

@RestController
@RequestMapping("/api/packages")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class PostPackageController {

    private final IPostPackageService service;

    public PostPackageController(IPostPackageService service) {
        this.service = service;
    }


    @GetMapping
    public List<PostPackageDTO> getAllPackages() {
        return service.getAllPackages();
    }


    @GetMapping("/{id}")
    public PostPackageDTO getPackageById(@PathVariable Integer id) {
        return service.getPackageById(id);
    }
}