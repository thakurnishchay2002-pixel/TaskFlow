package com.taskflow.service;

import com.taskflow.dto.TaskRequest;
import com.taskflow.entity.DeadlineFilter;
import com.taskflow.entity.Priority;
import com.taskflow.entity.Task;
import com.taskflow.entity.TaskStatus;
import com.taskflow.exception.TaskNotFoundException;
import com.taskflow.repository.TaskRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class TaskService {
    private final TaskRepository repository;

    public TaskService(TaskRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Task> findAll(String search, Priority priority, TaskStatus status,
                              DeadlineFilter deadline, String sortBy, String direction) {
        Specification<Task> specification = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.isBlank()) {
                String value = "%" + search.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), value),
                        cb.like(cb.lower(cb.coalesce(root.get("description"), "")), value)
                ));
            }

            if (priority != null) {
                predicates.add(cb.equal(root.get("priority"), priority));
            }

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            LocalDateTime now = LocalDateTime.now();
            LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
            LocalDateTime startOfTomorrow = startOfToday.plusDays(1);

            if (deadline == DeadlineFilter.OVERDUE) {
                predicates.add(cb.lessThan(root.get("deadline"), now));
                predicates.add(cb.notEqual(root.get("status"), TaskStatus.COMPLETED));
            } else if (deadline == DeadlineFilter.TODAY) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("deadline"), startOfToday));
                predicates.add(cb.lessThan(root.get("deadline"), startOfTomorrow));
            } else if (deadline == DeadlineFilter.UPCOMING) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("deadline"), now));
            } else if (deadline == DeadlineFilter.NO_DEADLINE) {
                predicates.add(cb.isNull(root.get("deadline")));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Sort.Direction sortDirection = "asc".equalsIgnoreCase(direction)
                ? Sort.Direction.ASC : Sort.Direction.DESC;

        String property = switch (sortBy == null ? "createdAt" : sortBy) {
            case "title" -> "title";
            case "deadline" -> "deadline";
            case "priority" -> "priority";
            default -> "createdAt";
        };

        return repository.findAll(specification, Sort.by(sortDirection, property));
    }

    @Transactional(readOnly = true)
    public Task findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new TaskNotFoundException(id));
    }

    public Task create(TaskRequest request) {
        Task task = new Task();
        copy(request, task);
        return repository.save(task);
    }

    public Task update(Long id, TaskRequest request) {
        Task task = findById(id);
        copy(request, task);
        return repository.save(task);
    }

    public Task updateStatus(Long id, TaskStatus status) {
        Task task = findById(id);
        task.setStatus(status);
        return repository.save(task);
    }

    public void delete(Long id) {
        repository.delete(findById(id));
    }

    private void copy(TaskRequest request, Task task) {
        task.setTitle(request.getTitle().trim());
        task.setDescription(request.getDescription() == null ? null : request.getDescription().trim());
        task.setPriority(request.getPriority());
        task.setStatus(request.getStatus());
        task.setDeadline(request.getDeadline());
    }
}
