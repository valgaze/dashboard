# Utilities

Utilities are used in development to generate the boilerplate code and directory structure
associated with the core taxonomies used in the project.

## Minimal in scope
These utilities aren't meant to be anywhere as complicated as other "code generation" solutions
like [rails generators](http://guides.rubyonrails.org/v3.0.3/generators.html). This was a purposeful
decision - often, complicated generators are seen as an alternative to a clear and clean project
structure, which is something we'd like to avoid. 

## Implementation
```sh
dashboard/ $ yarn make-component
yarn make-component v0.27.5
$ ./utilities/make-component
Let's make a new component.
Enter the name of your component, in dash-case: hello-world
* Copying template to components/hello-world...
* Replacing placeholders with variations of hello-world...
* Adding styles to central stylesheet...
You have a new component in src/components/hello-world:
* src/components/hello-world/index.js contains your component code.
* src/components/hello-world/_styles.scss contains your component styles.
* Press enter to open the documentation in your $EDITOR...
* Done.
dashboard/ $
```

1. Each utility is added to the `package.json` within the `.scripts` sub-object. This means that
   when `yarn make-component` (for example) is run, the script defined in the package.json (in this
   case, './utilities/make-component') is executed.
2. At least in every utility created thus-far, some information needs to be prompted from the user
   before creating the new resource, such as a name, description, etc. 
3. Each type of utility uses a special template version of that type of resource - for example,
   here's the [template for the make-component
   utility](https://github.com/DensityCo/dashboard/tree/trunk/src/components/.template). This
   template is copied into the resource directory (in the example of a component,
   `src/components/.template` is copied into `src/components/<component name>`) to scaffold out the
   new resource.
4. In addition, many of the templates contain special identifiers that look like `%THIS%` - for
   example, [here's one in the title of the
   readme](https://github.com/DensityCo/dashboard/blob/trunk/src/components/.template/README.md).
   The component helper replaces these identifiers with information that was prompted from the user
   earlier in the process. The percent syntax was chosen because javascript rarely contains two
   percentage signs on the same line, especially within the same whitespace-delimited word.
5. Lastly, most of these templates contain README's within them, and at the end of the process, your
   default text editor (fetched from the standard $EDITOR environment variable, or defaults to `vi`)
   will be opened referencing the README file which allows you to document the resource. By forcing
   the user to think about documenting the resource during its creation, it helps ensure that
   documentation is not forgotten about.
