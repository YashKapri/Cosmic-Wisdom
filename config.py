import os
from dotenv import load_dotenv

# Load environment variables from a.env file for local development
load_dotenv()

class Config:
    """Base configuration class with settings common to all environments."""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'a-hard-to-guess-string'
    
    # Flask-Pydantic configuration
    # By default, validation errors return a 400 status code.
    FLASK_PYDANTIC_VALIDATION_ERROR_STATUS_CODE = 400
    
    @staticmethod
    def init_app(app):
        # This method can be used for configuration-specific initializations
        pass

class DevelopmentConfig(Config):
    """Configuration for the development environment."""
    DEBUG = True
    CACHE_TYPE = 'null' # Disable caching to see code changes immediately
    CORS_RESOURCES = {r"/api/*": {"origins": "*"}} # Allow all origins for dev

class TestingConfig(Config):
    """Configuration for the testing environment."""
    TESTING = True
    SECRET_KEY = 'test-secret' # Use a static secret for predictable tests
    CACHE_TYPE = 'null' # Disable caching during tests
    CORS_RESOURCES = {r"/api/*": {"origins": "*"}}

class ProductionConfig(Config):
    """Configuration for the production environment."""
    DEBUG = False
    TESTING = False
    
    # Load allowed origins from an environment variable for enhanced security
    allowed_origins = os.environ.get('ALLOWED_ORIGINS', '').split(',')
    CORS_RESOURCES = {r"/api/*": {"origins": allowed_origins}}
    
    # Use a simple in-memory cache. For multi-node deployments,
    # consider 'RedisCache' or 'MemcachedCache'.
    CACHE_TYPE = 'SimpleCache'
    CACHE_DEFAULT_TIMEOUT = 3600 # Cache responses for 1 hour

# A dictionary to easily access configuration classes by name
config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}