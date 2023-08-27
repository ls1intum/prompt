package prompt.ls1.service;

import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import prompt.ls1.exception.StorageException;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import java.util.stream.Stream;

@Service
public class FileSystemStorageService {
    private final Path rootLocation = Paths.get("thesis_application_uploads");

    public String store(final MultipartFile file) {
        try {

            final File uploadDirectory = rootLocation.toFile();
            if (!uploadDirectory.exists()) {
                uploadDirectory.mkdirs();
            }

            if (file.isEmpty()) {
                throw new StorageException("Failed to store empty file.");
            }
            final String filename = StringUtils.cleanPath(UUID.randomUUID() + "-" + file.getOriginalFilename());
            if (filename.contains("..")) {
                throw new StorageException(
                        "Cannot store file with relative path outside current directory "
                                + filename);
            }
            try (final InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, this.rootLocation.resolve(filename),
                        StandardCopyOption.REPLACE_EXISTING);
                return filename;
            }
        }
        catch (final IOException e) {
            throw new StorageException("Failed to store file.", e);
        }
    }

    public Stream<Path> loadAll() {
        try {
            return Files.walk(this.rootLocation, 1)
                    .filter(path -> !path.equals(this.rootLocation))
                    .map(this.rootLocation::relativize);
        }
        catch (final IOException e) {
            throw new StorageException("Failed to read stored files", e);
        }
    }

    public FileSystemResource load(final String filename) {
        return new FileSystemResource(this.rootLocation.resolve(filename));
    }

    public void deleteAll() {
        FileSystemUtils.deleteRecursively(rootLocation.toFile());
    }

    public void init() {
        try {
            Files.createDirectories(rootLocation);
        }
        catch (final IOException e) {
            throw new StorageException("Could not initialize storage", e);
        }
    }
}
