package com.callcastlecare.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(name = "spring.data.redis.enabled", havingValue = "true", matchIfMissing = true)
public class RedisTestService {

    private final RedisTemplate<String, Object> redisTemplate;

    @Autowired
    public RedisTestService(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    /**
     * Set a key-value pair in Redis
     * 
     * @param key the key
     * @param value the value
     */
    public void setValue(String key, String value) {
        redisTemplate.opsForValue().set(key, value);
    }

    /**
     * Get a value from Redis by key
     * 
     * @param key the key
     * @return the value
     */
    public Object getValue(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    /**
     * Delete a key from Redis
     * 
     * @param key the key
     */
    public void deleteValue(String key) {
        redisTemplate.delete(key);
    }
}
