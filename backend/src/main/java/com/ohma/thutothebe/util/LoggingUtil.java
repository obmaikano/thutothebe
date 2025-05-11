package com.ohma.thutothebe.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class LoggingUtil {
    
    public static Logger getLogger(Class<?> clazz) {
        return LoggerFactory.getLogger(clazz);
    }

    /**
     * Parameterized error logging with exception at the end (matches slf4j signature)
     */
    public static void error(Logger logger, String message, Object... args) {
        logger.error(message, args);
    }

    public static void error(Logger logger, String message, Throwable throwable) {
        logger.error(message, throwable);
    }

    public static void error(Logger logger, String message, Object[] args, Throwable throwable) {
        logger.error(message, args, throwable);
    }

    // Deprecated: use error() instead
    @Deprecated
    public static void logError(Logger logger, String message, Throwable throwable) {
        logger.error(message, throwable);
    }
    @Deprecated
    public static void logError(Logger logger, String message, Object... args) {
        logger.error(message, args);
    }
    @Deprecated
    public static void logError(Logger logger, String message, Throwable throwable, Object... args) {
        logger.error(message, args, throwable);
    }

    public static void logInfo(Logger logger, String message, Object... args) {
        logger.info(message, args);
    }

    public static void logDebug(Logger logger, String message, Object... args) {
        logger.debug(message, args);
    }

    public static void logWarn(Logger logger, String message) {
        logger.warn(message);
    }

    public static void logWarn(Logger logger, String message, Object... args) {
        logger.warn(message, args);
    }

    public static void logWarn(Logger logger, String message, Throwable throwable) {
        logger.warn(message, throwable);
    }
} 