// Makes even nested props a partial
type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};