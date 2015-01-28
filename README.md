# &lt;u-avatar&gt;

Universal avatar makes it possible to fetch/generate an avatar based on the information you have about that user. 
We use a fallback system that if for example an invalid Facebook ID is used it will try Google, and so on.

For the moment we support following types:
* Facebook
* Google
* Skype
* Gravatar
* Name initials
* Custom text
* Custom image

The fallbacks are in the same order as the list above were Facebook has the highest priority.

## Demo

[Check it live!](http://sitebase.github.io/u-avatar)

## Install

Install the component using [Bower](http://bower.io/):

```sh
$ bower install u-avatar --save
```

Or [download as ZIP](https://github.com/sitebase/u-avatar/archive/master.zip).


## Usage

1. Import Web Components' polyfill:

    ```html
    <script src="bower_components/platform/platform.js"></script>
    ```

2. Import Custom Element:

    ```html
    <link rel="import" href="bower_components/u-avatar/dist/u-avatar.html">
    ```

3. Start using it!

    ```html
    <u-avatar></u-avatar>
    ```

Some examples:

    <u-avatar google-id="118096717852922241760" size="100" round="true"></u-avatar>
    <u-avatar facebook-id="100008343750912" size="150"></u-avatar>
    <u-avatar skype-id="sitebase" size="200"></u-avatar>
    <u-avatar name="Wim Mostmans" size="150"></u-avatar>
    <u-avatar value="86%" size="40"></u-avatar>
    <u-avatar size="100" facebook-id="invalidfacebookusername" src="http://www.gravatar.com/avatar/a16a38cdfe8b2cbd38e8a56ab93238d3"></u-avatar>

## Options

|   Attribute   |      Options      | Default |                                Description                                 |
| ------------- | ----------------- | ------- | -------------------------------------------------------------------------- |
| `email`       | *string*          |         | String of the email address of the user. You can also provide an MD5 hash. |
| `facebook-id` | *int* OR *string* |         |                                                                            |
| `google-id`   | *int*             |         |                                                                            |
| `skype-id`    | *string*          |         |                                                                            |
| `name`        | *string*          |         | Will be used to generate avatar based on the initials of the person        |
| `value`       | *string*          |         | Show a value as avatar                                                     |
| `color`       | *string*          | random  | Used in combination with `name` and `value`                                |
| `size`        | *int*             | 50      | Size of the avatar                                                         |
| `round`       | *bool*            | false   | Round the avatar corners                                                   |
| `src`         | *string*          |         | Fallback image to use                                                      |

## Development

In order to run it locally you'll need to fetch some dependencies and a basic server setup.

* Install [Bower](http://bower.io/) & [Grunt](http://gruntjs.com/):

    ```sh
    $ [sudo] npm install -g bower grunt-cli
    ```

* Install local dependencies:

    ```sh
    $ bower install && npm install
    ```

* To test your project, start the development server and open `http://localhost:8000`.

    ```sh
    $ grunt server
    ```

* To build the distribution files before releasing a new version.

    ```sh
    $ grunt build
    ```

* To provide a live demo, send everything to `gh-pages` branch.

    ```sh
    $ grunt deploy
    ```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History

For detailed changelog, check [Releases](https://github.com/sitebase/u-avatar/releases).

## License

[MIT License](http://opensource.org/licenses/MIT)

## Todo
* Find solution for twitter. You first need to request user info to get the avatar url, but authentication is needed :(
* Github support: https://avatars2.githubusercontent.com/u/421104?v=3&s=100