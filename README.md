# idea-inspection-support

IntelliJ系IDEのインスペクションCLIのサポートツールです。

## インストール

```bash
npm install altus5/idea-inspection-support --save-dev
```

## サブコマンド

サブコマンドで実行します。

* [clean](#clean)
* [report](#report)
* [scope](#scope-インスペクションのスコープを作成する)

### clean インスペクション結果の削除

インスペクション結果は自動では削除されないので、コードを修正して再度インスペクションを実行しても、同じ結果が再報告されることがあります。


```bash
npx idea-inspection-support clean [output-path]
```

* output-path: インスペクションの結果ファイルが出力されたディレクトリ

### report インスペクション結果を変換

インスペクションを実行して出力されたXMLファイルを、見やすい形式に変換してレポート出力します。
検出するエラーレベルなどは、固定で実装されているので、任意のレベルに変更する場合は、コードを修正して使ってください。

```bash
npx idea-inspection-support report [output-path]
```

* output-path: インスペクションの結果ファイルが出力されたディレクトリ

### scope インスペクションのスコープを作成する

スコープはGUIで設定すればよいのだけど、IntelliJを使っていない人でも、スコープの設定を可能とするためのツールです。  
インスペクションしたいコードのファイルパターンをjsonファイルに記述しておいて、本サブコマンドを実行すると .idea のディレクトリ下にスコープの設定をXMLで保存します。

スコープは、[スコープ言語構文リファレンス](https://pleiades.io/help/phpstorm/scope-language-syntax-reference.html) というもので記述するんですが、ややメンドウなので、[jsonファイル](#jsonファイルの例)に見慣れた glob 形式のパターンで指定できるようにしています。 

glob 形式からの変換は、単純なことしかできないので、スコープ言語を使いこなして指定したい場合には、GUIから設定したものを使ってください。

```bash
npx idea-inspection-support scope [project-path] [scope-name] [file-pattern-json] [module-name]
```

* project-path: プロジェクトのパス（.ideaディレクトリのあるディレクトリ）
* scope-name: scope名
* file-pattern-json: ファイルパターンを記述したjsonファイル
* module-name: モジュール名（プロジェクト名）※指定がない場合は全モジュールが対象になります。

##### jsonファイルの例
```json
[
  "controllers/*.php",
  "models/*.php",
  "views/**/*.php",
  "common/*.php"
]
```
