package com.taskflow.service;

import com.taskflow.dto.TaskRequest;
import com.taskflow.entity.Priority;
import com.taskflow.entity.Task;
import com.taskflow.entity.TaskStatus;
import com.taskflow.exception.TaskNotFoundException;
import com.taskflow.repository.TaskRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class TaskServiceTest {
    @Mock TaskRepository repository;
    @InjectMocks TaskService service;

    @Test
    void createsTask() {
        TaskRequest request = request("Build dashboard");
        when(repository.save(any(Task.class))).thenAnswer(inv -> inv.getArgument(0));

        Task result = service.create(request);

        assertEquals("Build dashboard", result.getTitle());
        assertEquals(Priority.HIGH, result.getPriority());
        assertEquals(TaskStatus.PENDING, result.getStatus());
        verify(repository).save(any(Task.class));
    }

    @Test
    void throwsWhenTaskDoesNotExist() {
        when(repository.findById(42L)).thenReturn(Optional.empty());
        assertThrows(TaskNotFoundException.class, () -> service.findById(42L));
    }

    @Test
    void updatesStatus() {
        Task task = new Task();
        task.setTitle("Demo");
        task.setPriority(Priority.MEDIUM);
        task.setStatus(TaskStatus.PENDING);
        when(repository.findById(1L)).thenReturn(Optional.of(task));
        when(repository.save(any(Task.class))).thenAnswer(inv -> inv.getArgument(0));

        Task result = service.updateStatus(1L, TaskStatus.COMPLETED);

        assertEquals(TaskStatus.COMPLETED, result.getStatus());
    }

    private TaskRequest request(String title) {
        TaskRequest r = new TaskRequest();
        r.setTitle(title);
        r.setDescription("Description");
        r.setPriority(Priority.HIGH);
        r.setStatus(TaskStatus.PENDING);
        return r;
    }
}
