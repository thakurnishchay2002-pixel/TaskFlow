package com.taskflow.controller;

import com.taskflow.dto.ApiResponse;
import com.taskflow.dto.StatusUpdateRequest;
import com.taskflow.dto.TaskRequest;
import com.taskflow.entity.DeadlineFilter;
import com.taskflow.entity.Priority;
import com.taskflow.entity.Task;
import com.taskflow.entity.TaskStatus;
import com.taskflow.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService service;

    public TaskController(TaskService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Task>>> getTasks(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(defaultValue = "ALL") DeadlineFilter deadline,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        return ResponseEntity.ok(ApiResponse.success(
                "Tasks retrieved successfully",
                service.findAll(search, priority, status, deadline, sortBy, direction)
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Task>> getTask(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Task retrieved successfully", service.findById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Task>> create(@Valid @RequestBody TaskRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Task created successfully", service.create(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Task>> update(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Task updated successfully", service.update(id, request)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Task>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                "Task status updated successfully",
                service.updateStatus(id, request.getStatus())
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Task deleted successfully", null));
    }
}
