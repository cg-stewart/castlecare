package com.callcastlecare.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.callcastlecare.api.service.RedisTestService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/redis-test")
@ConditionalOnProperty(name = "spring.data.redis.enabled", havingValue = "true", matchIfMissing = true)
public class RedisTestController {

    private final RedisTestService redisTestService;

    @Autowired
    public RedisTestController(RedisTestService redisTestService) {
        this.redisTestService = redisTestService;
    }

    @PostMapping("/set")
    public ResponseEntity<Map<String, String>> setValue(@RequestParam String key, @RequestParam String value) {
        redisTestService.setValue(key, value);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Value set successfully");
        response.put("key", key);
        response.put("value", value);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/get")
    public ResponseEntity<Map<String, Object>> getValue(@RequestParam String key) {
        Object value = redisTestService.getValue(key);
        
        Map<String, Object> response = new HashMap<>();
        response.put("key", key);
        response.put("value", value);
        
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Map<String, String>> deleteValue(@RequestParam String key) {
        redisTestService.deleteValue(key);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Value deleted successfully");
        response.put("key", key);
        
        return ResponseEntity.ok(response);
    }
}
