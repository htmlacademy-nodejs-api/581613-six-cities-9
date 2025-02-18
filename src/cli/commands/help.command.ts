import { Command } from './command.interface.js';
import chalk from 'chalk';

export class HelpCommand implements Command {
  public readonly name = '--help';

  public execute(..._parameters: string[]): void {
    console.info(`
    ${chalk.bgCyanBright.bold('Программа для подготовки данных для REST API сервера.')}

    ${chalk.green('Пример: cli.js --<command> [--arguments].')}

    ${chalk.yellow(`Команды:
            ${chalk.bold('--version')}:         # выводит номер версии
            ${chalk.bold('--help')}:            # печатает этот текст
            ${chalk.bold('--import <path>')}:   # импортирует данные из TSV`)}
    `);
  }
}
