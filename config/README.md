This dir contains one file that actually matters: `config.json`. It's installation specific ([see differences here](https://platform.sh/blog/2021/we-need-to-talk-about-the-env/)), and should contain the following fields:

```json
{
    "storage": {
        "provider": "required",
        "options": {
            "accessID": "dependant",
            "secret": "dependant",
            "container": "dependant",
            "path":"dependant",
        }
    }
}
```

## Storage

Depending on `provider`, the `options` field will need different fields. If the provider is `localstorage`, then only `options.path` is required with all others having no effect. Otherwise `options.accessID`, `options.secret` and `options.container` are required and `options.path` has no effect.