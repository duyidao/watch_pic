import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
// eslint-disable-next-line no-control-regex
var INVALID_CHAR_REGEX = /[\u0000-\u001F"#$&*+,:;<=>?[\]^`{|}\u007F]/g;
var DRIVE_LETTER_REGEX = /^[a-z]:/i;
// https://vite.dev/config/
export default defineConfig({
    build: {
        outDir: 'docs',
        rollupOptions: {
            output: {
                // https://github.com/rollup/rollup/blob/master/src/utils/sanitizeFileName.ts
                sanitizeFileName: function (name) {
                    var match = DRIVE_LETTER_REGEX.exec(name);
                    var driveLetter = match ? match[0] : "";
                    // A `:` is only allowed as part of a windows drive letter (ex: C:\foo)
                    // Otherwise, avoid them because they can refer to NTFS alternate data streams.
                    return (driveLetter +
                        name.slice(driveLetter.length).replace(INVALID_CHAR_REGEX, ""));
                },
            },
        },
    },
    plugins: [vue()],
    server: {
        port: 6688,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@comp': path.resolve(__dirname, 'src/components')
        }
    },
});
